package buddies;

import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.SuperMethodCall;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.instrument.Instrumentation;

import static net.bytebuddy.matcher.ElementMatchers.named;

public class BAgent {
    public static void premain(String args, Instrumentation inst) {
        System.out.println("=========== agent hunts =========== ");
        new AgentBuilder.Default().type(ElementMatchers.nameStartsWith("forest.city"))
                .transform((DynamicType.Builder<?> builder, TypeDescription typeDescription) ->
                        builder.method(named("run").or(named("start")))
                                .intercept(MethodDelegation.to(BInterceptor.class).andThen(SuperMethodCall.INSTANCE)))
                .installOn(inst);
    }
}
