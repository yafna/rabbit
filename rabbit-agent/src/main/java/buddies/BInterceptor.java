package buddies;

import net.bytebuddy.implementation.bind.annotation.Origin;

import java.lang.reflect.Method;

public class BInterceptor {
    public void intercept(@Origin Method method) throws Exception {
        System.out.println("buddy thread = " + Thread.currentThread().getName());
    }
}
