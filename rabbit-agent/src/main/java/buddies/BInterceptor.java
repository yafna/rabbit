package buddies;

import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class BInterceptor {
    @RuntimeType
    public Object intercept(@AllArguments Object[] allArguments, @Origin Method method) throws InvocationTargetException, IllegalAccessException {
        System.out.println("blablalbla = ");
        return method.invoke(allArguments);
    }
}
