package hare.displayer.view.controller;

import hare.displayer.dto.ThreeData;
import hare.displayer.dto.TreeItem;
import hare.displayer.service.Geometry;
import hare.displayer.service.TimeLine;
import model.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
@RequestMapping("/data")
public class TimeLineController {
    @Autowired
    private TimeLine timeLine;
    @Autowired
    private Geometry geometry;


    private ThreeData calculated;

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
        if(calculated == null) {
            calculated = new ThreeData(geometry.getTreeWithCoordinates(timeLine.allData()));
        }
        return calculated;
    }

}
