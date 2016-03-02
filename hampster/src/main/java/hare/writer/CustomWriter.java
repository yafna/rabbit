package hare.writer;


import model.MethodInfo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class CustomWriter {
    public final static CustomWriter INSTANCE = new CustomWriter();
    private BufferedWriter writer = null;
    private List<String> messages = new ArrayList<>();

    private CustomWriter() {
        File f = Paths.get(Defaults.FILE_NAME_PREFIX).toFile();
        if (f.exists()) {
            f.delete();
        }
        try {
            writer = new BufferedWriter(new FileWriter(Defaults.FILE_NAME_PREFIX, true));
        } catch (IOException e) {
            System.out.println("no logging for us = " + e.getLocalizedMessage());
        }
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                if (writer != null) {
                    try {
                        writer.close();
                    } catch (IOException e) {
                        System.out.println("failed to close writer " + e.getLocalizedMessage());
                    }
                }
            }
        });
    }

    public synchronized void log(String s) {
        write(s);
    }

    public synchronized void log(boolean isStart, String className, String methodName, long timestamp, String thName) {
        MethodInfo mi = new MethodInfo(className, methodName, timestamp, thName, isStart);
        write(mi.toString());
    }

    private void write(String msg) {
        if (writer != null) {
            try {
                writer.write(msg);
                writer.newLine();
            } catch (IOException e) {
                System.out.println("log error " + e.getLocalizedMessage());
            }
        }
    }
}
