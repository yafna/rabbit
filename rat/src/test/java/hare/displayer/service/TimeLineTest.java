package hare.displayer.service;

import model.MethodInfo;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class TimeLineTest {

    @Test
    public void readAndReturn() {
        TimeLine tl = new TimeLine();
        List<MethodInfo> res = tl.getPackOfData(4);
        Assert.assertNotNull(res);
        Assert.assertEquals(4, res.size());
    }
}
