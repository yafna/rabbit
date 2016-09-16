package hare.displayer.service;

import hare.displayer.dto.TreeItem;
import model.MethodInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Geometry {

    private float rad = 50;

    public TreeItem getTreeWithCoordinates(List<MethodInfo> data) {
        TreeItem root = buildTreeStructure(data);
        root.setXYZ(0, 0, 40);
        setXYZ(root);
        return root;
    }


    private void setXYZ(TreeItem root) {
        if (!root.getNodes().isEmpty()) {
            float rotation = 360 / root.getNodes().size();
            float angle = 0;
            for (TreeItem treeItem : root.getNodes()) {
                treeItem.setXYZ(
                        root.getX() - Math.round(rad * (float) Math.cos(angle * Math.PI / 180)),
                        root.getY() - 50,
                        root.getZ() - Math.round(rad * (float) Math.sin(angle * Math.PI / 180))
                );
                angle += rotation;
                setXYZ(treeItem);
            }
        }
    }

    private TreeItem buildTreeStructure(List<MethodInfo> data) {
        TreeItem root = new TreeItem("");

        for (MethodInfo methodInfo : data) {
            String[] path = methodInfo.getClassName().split("/");
            TreeItem branch = root;
            for (String pathItem : path) {
                if (!branch.hasChildByShortName(pathItem)) {
                    branch.getNodes().add(new TreeItem(branch.getName() + "." + pathItem));
                }
                branch = branch.getChildByShortName(pathItem);
            }
        }

        return root;
    }
}
