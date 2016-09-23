package hare.displayer.service;

import hare.displayer.dto.Colors;
import hare.displayer.dto.ThreeData;
import hare.displayer.dto.TreeItem;
import model.MethodInfo;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.util.List;

@Service
public class Geometry {

    private float rad = 100;

    public TreeItem getTreeWithCoordinates(List<MethodInfo> data) {
        TreeItem root = buildTreeStructure(data);
        root.setXYZ(0, 500, 0);
        root.setColor(Color.darkGray);
        setXYZ(root, 0, 360);
        return root;
    }


    private void setXYZ(TreeItem root, float angleS, float angleE) {
        if (!root.getNodes().isEmpty()) {
            float rotation = Math.abs(Math.abs(angleS) - Math.abs(angleE))/ root.getNodes().size();
            float angle = angleS;
            for (TreeItem treeItem : root.getNodes()) {
                treeItem.setXYZ(
                        root.getX() - Math.round(rad * (float) Math.cos(angle * Math.PI / 180)),
                        root.getY() - 50,
                        root.getZ() - Math.round(rad * (float) Math.sin(angle * Math.PI / 180))
                );
                setXYZ(treeItem, angle+2, angle+rotation);
                angle += rotation;
            }
        }
    }

    // **what to do with the anonymous instances?
    private TreeItem buildTreeStructure(List<MethodInfo> data) {
        TreeItem root = new TreeItem("");

        for (MethodInfo methodInfo : data) {
            String[] path = methodInfo.getClassName().split("/");
            TreeItem branch = root;
            for (int i =0; i < path.length-1; ++i){
                if (!branch.hasChildByShortName(path[i])) {
                    branch.getNodes().add(new TreeItem(branch.getName() + "+" + path[i]));
                }

                branch = branch.getChildByShortName(path[i]);
            }
            if (!branch.hasChildByShortName(path[path.length-1])) {
                branch.getNodes().add(new TreeItem(branch.getName() + "+" + path[path.length-1], Colors.COLOR_CLASS.getColor()));
            }
            branch = branch.getChildByShortName(path[path.length-1]);
            if (!branch.hasChildByShortName(methodInfo.getMethodName())) {
                branch.getNodes().add(new TreeItem(branch.getName() + ":" + methodInfo.getMethodName(), Colors.COLOR_METHOD.getColor()));
            }
        }

        return root;
    }

    public ThreeData recalculate(ThreeData allExpandedState, ThreeData storedState, String fullName) {
        boolean isExpand = false;
        TreeItem item = findNode(storedState.getRoot(), fullName);
        if(item.isLeaf()){
            TreeItem itemExp = findNode(allExpandedState.getRoot(), fullName);
            for(TreeItem child: itemExp.getNodes()){
                TreeItem copyCh = child.clone();
                copyCh.getNodes().clear();
                item.getNodes().add(copyCh);
            }
            item = itemExp;
        }else {
            item.getNodes().clear();
        }
        return storedState;
    }

    private TreeItem findNode(TreeItem root, String fullName) {
        if(root.getName().equals(fullName)){
            return root;
        }
        for(TreeItem item : root.getNodes()){
            TreeItem res = findNode(item, fullName);
            if(res != null){
                return res;
            }
        }
        return null;
    }
}
