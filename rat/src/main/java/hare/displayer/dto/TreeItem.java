package hare.displayer.dto;

import lombok.Data;

import java.awt.Color;
import java.util.ArrayList;
import java.util.List;

@Data
public class TreeItem implements Cloneable {
    private String name;
    private String shortName;
    private int x;
    private int y;
    private int z;
    private Color color = Colors.COLOR_PACKAGE.getColor();
    private List<TreeItem> nodes = new ArrayList<>();

    public TreeItem(String name) {
        setName(name);
    }

    public TreeItem(String name, Color color) {
        setName(name);
        setColor(color);
    }

    public void setName(String name) {
        this.name = name;
        String[] its = name.split("[+:]");
        setShortName(its[its.length - 1]);
    }

    public boolean isLeaf() {
        return nodes.isEmpty();
    }

    public void setXYZ(int x, int y, int z) {
        setX(x);
        setY(y);
        setZ(z);
    }

    public TreeItem getChildByShortName(String shortName) {
        for (TreeItem child : nodes) {
            if (child.getShortName().equals(shortName)) {
                return child;
            }
        }
        return null;
    }

    public boolean hasChildByShortName(String shortName) {
        for (TreeItem child : nodes) {
            if (child.getShortName().equals(shortName)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public TreeItem clone(){
        try {
            TreeItem item = (TreeItem) super.clone();
            List<TreeItem> nodes = new ArrayList<>();
            for (TreeItem node : item.getNodes()) {
                nodes.add(node.clone());
            }
            item.getNodes().clear();
            item.getNodes().addAll(nodes);
            return item;
        }catch (CloneNotSupportedException ex){
            ex.printStackTrace();
            return null;
        }
    }
}
