package hare.displayer.view.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/data")
public class TimeLineController {
    @RequestMapping(method = RequestMethod.GET)
    public String index() {
        return "Greetings from Spring Boot!";
    }
}
