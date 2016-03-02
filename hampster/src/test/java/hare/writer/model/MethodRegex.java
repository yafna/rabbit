package hare.writer.model;

import model.Parser;
import org.junit.Assert;
import org.junit.Test;

public class MethodRegex {

    @Test
    public void testGoodMethodNames1() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/Main|main|1456146229033|main"));
        Assert.assertNotNull(Parser.getMethodLine("s|forest/city/Main|main|1456146229033|main"));
    }

    @Test
    public void testGoodMethodNames2() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/food/Bee|<init>|1456146229039|main"));
    }

    @Test
    public void testGoodMethodNames3() {
        Assert.assertTrue(Parser.isMethodLine("e|forest/city/food/Carrot|<init>|1456146229041|main"));
    }

    @Test
    public void testGoodMethodNames4() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/food/Carrot|run|1456146229041|Thread-1"));
    }
}
