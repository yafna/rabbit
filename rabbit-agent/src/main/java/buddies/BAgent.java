package buddies;

import net.bytebuddy.ByteBuddy;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.NamedElement;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.SuperMethodCall;
import net.bytebuddy.matcher.ElementMatcher;
import net.bytebuddy.matcher.ElementMatchers;

import java.lang.instrument.Instrumentation;

import static net.bytebuddy.matcher.ElementMatchers.named;

public class BAgent {
    public static void premain(String args, Instrumentation inst) {
        System.out.println("=========== agent hunts =========== ");


        // Find me a class called "java.lang.System"
        final ElementMatcher.Junction<NamedElement> systemType = ElementMatchers.named("forest.city.food.Bee");

        // And then find a method called setSecurityManager and tell MySystemInterceptor to
        // intercept it (the method binding is smart enough to take it from there)
        final AgentBuilder.Transformer transformer =
                (b, typeDescription) -> b.method(ElementMatchers.any())
                        .intercept(MethodDelegation.to(BInterceptor.class));

        // Disable a bunch of stuff and turn on redefine as the only option
        final ByteBuddy byteBuddy = new ByteBuddy().with(Implementation.Context.Disabled.Factory.INSTANCE);
        final AgentBuilder agentBuilder = new AgentBuilder.Default()
                .with(byteBuddy)
                .with(AgentBuilder.InitializationStrategy.NoOp.INSTANCE)
                .with(AgentBuilder.RedefinitionStrategy.REDEFINITION)
                .with(AgentBuilder.TypeStrategy.Default.REDEFINE)
                .type(systemType)
                .transform(transformer);
//        new AgentBuilder.Default()
//                .type(ElementMatchers.nameStartsWith("forest"))
//                .transform((DynamicType.Builder<?> builder, TypeDescription typeDescription) ->
//                        builder.method(ElementMatchers.any())
//                                .intercept(MethodDelegation.to(BInterceptor.class).andThen(SuperMethodCall.INSTANCE)))
//                .with(AgentBuilder.RedefinitionStrategy.REDEFINITION)
//                .installOn(inst);
        agentBuilder.installOn(inst);
    }
}
