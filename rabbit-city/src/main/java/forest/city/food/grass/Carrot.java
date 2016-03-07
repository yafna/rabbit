package forest.city.food.grass;

public class Carrot extends Healthy implements Runnable {

    @Override
    public void run() {
        System.out.println("tc = " + Thread.currentThread().getName());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " dinner achieved");
    }
}
