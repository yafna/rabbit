package hare.displayer.service;

import hare.writer.Defaults;
import model.MethodInfo;
import model.Parser;
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
    private BufferedReader reader = null;

    public TimeLine() {
        this("../" + Defaults.FILE_NAME_PREFIX);
    }

    private TimeLine(String fileName) {
        if (!Paths.get(fileName).toFile().exists()) {
            System.out.println("fileName = " + fileName);
        }
        try {
            this.reader = new BufferedReader(new FileReader(fileName));
        } catch (FileNotFoundException e) {
            System.out.println("failed to read data = " + e.getLocalizedMessage());
        }
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException e) {
                        System.out.println("failed to close reader " + e.getLocalizedMessage());
                    }
                }
            }
        });
    }

    public List<MethodInfo> getPackOfData(int size){
        List<MethodInfo> res = new ArrayList<>();
        try {
            String line = reader.readLine();
            while (line != null && size > 1) {
                if (Parser.isMethodLine(line)) {
                    res.add(Parser.getMethodLine(line));
                }
                size--;
                line = reader.readLine();
            }

            if (line != null && Parser.isMethodLine(line)) {
                res.add(Parser.getMethodLine(line));
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return res;
    }
}
