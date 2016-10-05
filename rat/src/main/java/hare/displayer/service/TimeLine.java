package hare.displayer.service;

import model.MethodInfo;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimeLine {
    private BufferedReader keepStateReader = null;
    private String fileName;

    public TimeLine() {
        this(System.getProperty("data.file", "../sandbox/fffffuuu.txt"));
    }

    private TimeLine(String fileName) {
        this.fileName = fileName;
        if (!Paths.get(fileName).toFile().exists()) {
            System.out.println("fileName = " + fileName);
        }
        try {
            this.keepStateReader = new BufferedReader(new FileReader(fileName));
        } catch (FileNotFoundException e) {
            System.out.println("failed to read data = " + e.getLocalizedMessage());
        }
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                if (keepStateReader != null) {
                    try {
                        keepStateReader.close();
                    } catch (IOException e) {
                        System.out.println("failed to close keepStateReader " + e.getLocalizedMessage());
                    }
                }
            }
        });
    }

    public List<MethodInfo> allData() {
        List<MethodInfo> res = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line = reader.readLine();
            while (line != null) {
                if (MethodInfo.isMethodLine(line)) {
                    res.add(new MethodInfo(line));
                }
                line = reader.readLine();
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return res;
    }

    public List<MethodInfo> packOfData(int size) {
        List<MethodInfo> res = new ArrayList<>();
        try {
            String line = keepStateReader.readLine();
            while (line != null && size > 1) {
                if (MethodInfo.isMethodLine(line)) {
                    res.add(new MethodInfo(line));
                }
                size--;
                line = keepStateReader.readLine();
            }

            if (line != null && MethodInfo.isMethodLine(line)) {
                res.add(new MethodInfo(line));
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return res;
    }
}
