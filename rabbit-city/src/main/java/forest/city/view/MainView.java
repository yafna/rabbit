package forest.city.view;

import forest.city.food.fast.Gopher;
import forest.city.food.fast.Hairy;
import forest.city.food.fast.TasmanianDevil;
import forest.city.food.grass.Carrot;
import forest.city.food.fast.Rabbit;
import forest.city.food.grass.Healthy;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MainView {
    private List<Hairy> creatures = new ArrayList<>();
    private List<Carrot> carrots = new ArrayList<>();
    private Random r = new Random(System.currentTimeMillis());

    public void createAndShowGUI() {
        //Create and set up the window.
        JFrame frame = new JFrame("HelloWorldSwing");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 400);

        final JLabel lblRabbits = new JLabel("Rabbit size : " + creatures.size());
        final JLabel lblCarrots = new JLabel("Carrots size : " + carrots.size());
        JButton btnR = new JButton("More creatures");
        btnR.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int x = r.nextInt(3);
                switch (x){
                    case 0: {
                        creatures.add(new Rabbit("rbbt" + System.currentTimeMillis()));
                        break;
                    }
                    case 1: {
                        creatures.add(new Gopher("gophr" + System.currentTimeMillis()));
                        break;
                    }
                    case 2: {
                        creatures.add(new TasmanianDevil("ttt" + System.currentTimeMillis()));
                        break;
                    }
                }
                lblRabbits.setText("Creatures size : " + creatures.size());
            }
        });
        JButton btnC = new JButton("More carrots");
        btnC.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                carrots.add(new Carrot());
                lblCarrots.setText("Carrots size : " + carrots.size());
            }
        });
        JButton btnFeed = new JButton("Feed rabbit");
        btnFeed.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (carrots.size() > 0) {
                    int x = r.nextInt(carrots.size());
                    Thread t = new Thread(carrots.get(x));
                    t.start();
                    carrots.remove(x);
                    lblCarrots.setText("Carrots size : " + carrots.size());
                }
            }
        });
        JButton btnKillR = new JButton("Kill rabbit");
        btnKillR.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (creatures.size() > 1) {
                    creatures.remove(0);
                    lblRabbits.setText("Rabbit size : " + creatures.size());
                }
            }
        });

        JPanel listPane = new JPanel();
        listPane.setLayout(new BoxLayout(listPane, BoxLayout.PAGE_AXIS));
        listPane.add(btnR);
        listPane.add(btnC);
        listPane.add(btnFeed);
        listPane.add(btnKillR);
        listPane.add(lblRabbits);
        listPane.add(lblCarrots);

        frame.getContentPane().add(listPane);

        //Display the window.
        frame.pack();
        frame.setVisible(true);
    }
}
