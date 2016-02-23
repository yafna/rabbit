package hare.displayer.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MethodInfo {
    private String className;
    private String methodName;
    private Long time;
    private String thName;
    private boolean isStart;
}
