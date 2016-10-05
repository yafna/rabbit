package hare.displayer.service;

import hare.displayer.dto.ThreeData;
import hare.displayer.dto.TreeItem;
import hare.displayer.view.config.Config;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {Config.class})
public class GeometryTest {

    @Autowired
    private TimeLine timeLine;

    @Autowired
    private Geometry geometry;

    @Test
    public void parse() {
        TreeItem itm = geometry.getTreeWithCoordinates(timeLine.allData());
        Assert.assertNotNull(itm);
    }

    @Test
    public void parseAndCollapse() {
        TreeItem itm = geometry.getTreeWithCoordinates(timeLine.allData());
        geometry.recalculate(new ThreeData(itm), new ThreeData(itm), "+forest+city+food+Bee");
        Assert.assertNotNull(itm);
    }
}
