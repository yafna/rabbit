package hare.writer.model;

import model.Parser;
import org.junit.Assert;
import org.junit.Test;

public class MethodRegex {

    @Test
    public void testGoodMethodNames1() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/Main|main|1457018596655|main|1077224866"));
        Assert.assertNotNull(Parser.getMethodLine("s|forest/city/Main|main|1457018596655|main|1077224866"));
    }

    @Test
    public void testGoodMethodNames2() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/food/Bee|<init>|1457018596658|main|1400799112"));
    }

    @Test
    public void testGoodMethodNames3() {
        Assert.assertTrue(Parser.isMethodLine("e|forest/city/food/Carrot|<init>|1457018596659|main|1345655642"));
    }

    @Test
    public void testGoodMethodNames4() {
        Assert.assertTrue(Parser.isMethodLine("s|forest/city/food/Carrot|run|1457018596660|Thread-1|1345655642"));
    }
}
