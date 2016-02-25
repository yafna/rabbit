package hare.displayer.view.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class TimeLineController {
    @RequestMapping("/hh")
    public String index() {
        return "index";
    }
}
