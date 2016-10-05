package hare.writer;

import model.MethodInfo;
import org.junit.Assert;
import org.junit.Test;

public class FormatConsistencyTest {
    @Test
    public void readWritePatternsCompatible() {
        MethodInfo methodInfo = new MethodInfo("a", "b", 123l, "c", true, 234);
        Assert.assertTrue(MethodInfo.isMethodLine(methodInfo.toString()));
        Assert.assertEquals(methodInfo, new MethodInfo(methodInfo.toString()));
    }
}
