package forest.city;

import forest.city.food.Bee;
import forest.city.view.MainView;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("tm = " + Thread.currentThread().getName());
        Bee bee = new Bee();
        bee.fly();
//        Carrot c = new Carrot();
//        for (int i = 0; i < 7; i++) {
//            Thread t = new Thread(c);
//            t.start();
//        }

        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                MainView view = new MainView();
                view.createAndShowGUI();
            }
        });
    }
}
