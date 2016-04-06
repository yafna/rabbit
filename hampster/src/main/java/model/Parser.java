package model;

import java.util.regex.Pattern;

/**
 * rough parsers
 * rules definitions are under progress
 * will be replaced nicely later
 */
public class Parser {
    private static final String METHOD_REGEX = "[s|e]\\|[\\w/$]+\\|[<>\\w]+\\|[0-9]+\\|.+\\|[0-9]+";
    private static final Pattern mp = Pattern.compile(METHOD_REGEX);

    public static boolean isMethodLine(String str) {
        return mp.matcher(str).matches();
    }

    public static MethodInfo getMethodLine(String str) {
        String[] strings = str.split("\\|");
        long time = Long.parseLong(strings[3]);
        int hash = Integer.parseInt(strings[5]);
        return new MethodInfo(strings[1], strings[2], time, strings[4], strings[0].charAt(0) == 's', hash);
    }
}
