package hare.displayer.view.controller;

import hare.displayer.dto.ThreeData;
import hare.displayer.dto.TreeItem;
import hare.displayer.service.Geometry;
import hare.displayer.service.TimeLine;
import lombok.extern.slf4j.Slf4j;
import model.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/data")
public class TimeLineController {
    @Autowired
    private TimeLine timeLine;
    @Autowired
    private Geometry geometry;

    private ThreeData allExpandedState;
    private ThreeData currentState;

    @RequestMapping("/pack")
    public
    @ResponseBody
    List<MethodInfo> getDefaultPack() {
        List<MethodInfo> pack = timeLine.packOfData(10);
        Collections.sort(pack, new Comparator<MethodInfo>() {
            @Override
            public int compare(MethodInfo o1, MethodInfo o2) {
                return (o1.getTime() - o2.getTime() > 0 ? 1 : -1);
            }
        });
        return pack;
    }

    @RequestMapping("/packAll")
    public
    @ResponseBody
    ThreeData getAll() {
        if(allExpandedState == null) {
            allExpandedState = new ThreeData(geometry.getTreeWithCoordinates(timeLine.allData()));
            currentState = allExpandedState.clone();
        }
        return allExpandedState;
    }

    @RequestMapping("/recalculate/packages/{name}")
    public
    @ResponseBody
    ThreeData recalculatePackeges(@PathVariable("name") String fullName) {
        log.trace("{} clicked" , fullName);
        currentState = geometry.recalculate(allExpandedState, currentState, fullName);
        return currentState;
    }
}
