package hare.writer;


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
    private String fileName = "fffffuuu.txt";

    private CustomWriter() {
        File f = Paths.get(fileName).toFile();
        if (f.exists()) {
            f.delete();
        }
        try {
            writer = new BufferedWriter(new FileWriter(fileName, true));
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
