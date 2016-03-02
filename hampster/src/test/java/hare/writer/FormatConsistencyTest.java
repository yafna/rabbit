package hare.writer;

import model.MethodInfo;
import model.Parser;
import org.junit.Assert;
import org.junit.Test;

public class FormatConsistencyTest {
    @Test
    public void readWritePatternsCompatible() {
        MethodInfo methodInfo = new MethodInfo("a", "b", 123l, "c", true);
        Assert.assertTrue(Parser.isMethodLine(methodInfo.toString()));
        Assert.assertEquals(methodInfo, Parser.getMethodLine(methodInfo.toString()));
    }
}
