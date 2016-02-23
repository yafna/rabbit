package hare.displayer.model;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.channels.ByteChannel;
import java.util.ArrayList;
import java.util.List;

public class TimeLine {
    private BufferedReader reader = null;
    public TimeLine(String fileName) {
        try {
            this.reader = new BufferedReader(new FileReader(fileName));
        } catch (FileNotFoundException e) {
            System.out.println("failed to read data = " + e.getLocalizedMessage());
        }
    }

    public List<MethodInfo> getPackOfData(int size){
        List<MethodInfo> res = new ArrayList<>();
        try {
            String line = reader.readLine();
            while (line != null && size > 1){
                if(Parser.isMethodLine(line)){
                    res.add(Parser.getMethodLine(line));
                }
                size--;
                line = reader.readLine();
            }

            if(Parser.isMethodLine(line)){
                res.add(Parser.getMethodLine(line));
            }

        }catch (IOException ex){
            ex.printStackTrace();
        }
        return res;
    }
}
