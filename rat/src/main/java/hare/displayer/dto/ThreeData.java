package hare.displayer.dto;

import lombok.Getter;

@Getter
public class ThreeData {
    private TreeItem root;
    private int itemsNum;

    public ThreeData(TreeItem root) {
        this.root = root;
        itemsNum = getNodesNum(root);
    }

    private int getNodesNum(TreeItem treeItem) {
        int num = 1;
        for (TreeItem node: treeItem.getNodes()){
            num += getNodesNum(node);
        }
        return num;
    }
}
