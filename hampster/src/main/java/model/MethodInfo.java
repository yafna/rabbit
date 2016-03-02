package model;

import java.io.Serializable;
import java.text.MessageFormat;

public class MethodInfo implements Serializable {
    private static final String METHOD_LOG_PATTERN = "{0}|{1}|{2}|{3}|{4}";

    private String className;
    private String methodName;
    private Long time;
    private String thName;
    private boolean start;

    public MethodInfo() {
    }

    public MethodInfo(String className, String methodName, Long time, String thName, boolean start) {
        this.className = className;
        this.methodName = methodName;
        this.time = time;
        this.thName = thName;
        this.start = start;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getThName() {
        return thName;
    }

    public void setThName(String thName) {
        this.thName = thName;
    }

    public boolean isStart() {
        return start;
    }

    public void setStart(boolean start) {
        this.start = start;
    }

    @Override
    public String toString() {
        return MessageFormat.format(METHOD_LOG_PATTERN, start ? "s" : "e", className, methodName, Long.toString(time), thName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MethodInfo that = (MethodInfo) o;

        if (start != that.start) return false;
        if (className != null ? !className.equals(that.className) : that.className != null) return false;
        if (methodName != null ? !methodName.equals(that.methodName) : that.methodName != null) return false;
        if (time != null ? !time.equals(that.time) : that.time != null) return false;
        return !(thName != null ? !thName.equals(that.thName) : that.thName != null);

    }

    @Override
    public int hashCode() {
        int result = className != null ? className.hashCode() : 0;
        result = 31 * result + (methodName != null ? methodName.hashCode() : 0);
        result = 31 * result + (time != null ? time.hashCode() : 0);
        result = 31 * result + (thName != null ? thName.hashCode() : 0);
        result = 31 * result + (start ? 1 : 0);
        return result;
    }
}
