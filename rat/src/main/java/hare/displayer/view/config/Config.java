package hare.displayer.view.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {
        "hare.displayer.view.controller",
        "hare.displayer.service"})
public class Config {
}