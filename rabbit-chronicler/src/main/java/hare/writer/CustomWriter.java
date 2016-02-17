package hare.writer;


import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

public class CustomWriter {
    public final static CustomWriter INSTANCE = new CustomWriter();
    public ArrayList<String> messages;
    private String fileName = "fffffuuu.txt";

    private CustomWriter() {
        File f = Paths.get(fileName).toFile();
        if (f.exists()) {
            f.delete();
        }
    }

    public void log(String s) {
        write(s);
    }

    private void write(String s) {
        try (FileWriter writer = new FileWriter(fileName, true)) {
            writer.write(s);
            writer.write("\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
