package hare.writer.model;

import model.MethodInfo;
import org.junit.Assert;
import org.junit.Test;

public class MethodRegex {

    @Test
    public void testGoodMethodNames1() {
        Assert.assertTrue(MethodInfo.isMethodLine("s|forest/city/Main|main|1457018596655|main|1077224866"));
        Assert.assertNotNull(new MethodInfo("s|forest/city/Main|main|1457018596655|main|1077224866"));
    }

    @Test
    public void testGoodMethodNames2() {
        Assert.assertTrue(MethodInfo.isMethodLine("s|forest/city/food/Bee|<init>|1457018596658|main|1400799112"));
    }

    @Test
    public void testGoodMethodNames3() {
        Assert.assertTrue(MethodInfo.isMethodLine("e|forest/city/food/Carrot|<init>|1457018596659|main|1345655642"));
    }

    @Test
    public void MethodInfo() {
        Assert.assertTrue(MethodInfo.isMethodLine("s|forest/city/food/Carrot|run|1457018596660|Thread-1|1345655642"));
    }
}
