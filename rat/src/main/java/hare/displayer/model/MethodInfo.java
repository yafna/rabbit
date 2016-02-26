package hare.displayer.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class MethodInfo implements Serializable{
    private String className;
    private String methodName;
    private Long time;
    private String thName;
    private boolean isStart;
}
