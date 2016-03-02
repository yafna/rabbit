package hare.displayer.view.controller;

import hare.displayer.service.TimeLine;
import model.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
        return timeLine.getPackOfData(5);
    }
}
