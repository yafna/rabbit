package hare.displayer.view.controller;

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
    public TimeLine timeLine;

    @RequestMapping("/pack")
    public
    @ResponseBody
    List<MethodInfo> getDefaultPack() {
        List<MethodInfo> pack = timeLine.getPackOfData(5);
        Collections.sort(pack, new Comparator<MethodInfo>() {
            @Override
            public int compare(MethodInfo o1, MethodInfo o2) {
                return (o1.getTime() - o2.getTime() > 0 ? 1 : -1);
            }
        });
        return pack;
    }
}
