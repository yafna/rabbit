package model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.text.MessageFormat;
import java.util.regex.Pattern;

@Data
@NoArgsConstructor
@EqualsAndHashCode
public class MethodInfo implements Serializable {
    private static final String METHOD_LOG_PATTERN = "{0}|{1}|{2}|{3}|{4}|{5}";
    private static final String METHOD_REGEX = "[s|e]\\|[\\w/$]+\\|[<>\\w]+\\|[0-9]+\\|.+\\|[0-9]+";
    private static final Pattern mp = Pattern.compile(METHOD_REGEX);

    private String className;
    private String methodName;
    private Long time;
    private String thName;
    private boolean start;
    private int hash;

    public MethodInfo(String filledPattern) {
        if(!isMethodLine(filledPattern)){
            throw  new IllegalArgumentException("Not matches expected pattern " + filledPattern);
        }
        String[] strings = filledPattern.split("\\|");
        long time = Long.parseLong(strings[3]);
        int hash = Integer.parseInt(strings[5]);
        init(strings[1], strings[2], time, strings[4], strings[0].charAt(0) == 's', hash);
    }

    public MethodInfo(String className, String methodName, Long time, String thName, boolean start, int hash) {
        init(className, methodName, time, thName, start, hash);
    }

    private void init(String className, String methodName, Long time, String thName, boolean start, int hash) {
        this.className = className;
        this.methodName = methodName;
        this.time = time;
        this.thName = thName;
        this.start = start;
        this.hash = hash;
    }

    public static boolean isMethodLine(String str) {
        return mp.matcher(str).matches();
    }

    @Override
    public String toString() {
        return MessageFormat.format(METHOD_LOG_PATTERN, start ? "s" : "e", className, methodName, Long.toString(time),
                thName, Integer.toString(hash));
    }
}
