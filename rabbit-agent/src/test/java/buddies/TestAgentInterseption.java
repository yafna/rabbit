package buddies;

import net.bytebuddy.agent.ByteBuddyAgent;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.loading.ByteArrayClassLoader;
import net.bytebuddy.dynamic.loading.PackageDefinitionStrategy;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import javax.management.openmbean.SimpleType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.security.AccessController;
import java.security.ProtectionDomain;
import java.util.Arrays;
import java.util.Collection;

import static net.bytebuddy.matcher.ElementMatchers.isAnnotatedWith;
import static net.bytebuddy.matcher.ElementMatchers.named;
import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(Parameterized.class)
public class TestAgentInterseption {
    @Parameterized.Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][]{
                {AgentBuilder.BinaryLocator.Default.EXTENDED},
                {AgentBuilder.BinaryLocator.Default.FAST},
                {AgentBuilder.BinaryLocator.ClassLoading.INSTANCE}
        });
    }

    private static final ProtectionDomain DEFAULT_PROTECTION_DOMAIN = null;
    private static final String FOO = "foo", BAR = "bar";
    private ClassLoader classLoader;
    private final AgentBuilder.BinaryLocator binaryLocator;

    public TestAgentInterseption(AgentBuilder.BinaryLocator binaryLocator) {
        this.binaryLocator = binaryLocator;
    }

    @Before
    public void setUp() throws Exception {
        classLoader = new ByteArrayClassLoader.ChildFirst(getClass().getClassLoader(),
                ClassFileExtraction.of(
                        Bar.class,
                        SimpleType.class),
                DEFAULT_PROTECTION_DOMAIN,
                AccessController.getContext(),
                ByteArrayClassLoader.PersistenceHandler.MANIFEST,
                PackageDefinitionStrategy.NoOp.INSTANCE);
    }

    @Test
    public void testAgentSelfInitialization() throws Exception {
        assertThat(ByteBuddyAgent.install(), instanceOf(Instrumentation.class));
        ClassFileTransformer classFileTransformer = new AgentBuilder.Default()
                .with(binaryLocator)
                .type(isAnnotatedWith(ShouldRebase.class), ElementMatchers.is(classLoader)).transform(new BarTransformer())
                .installOnByteBuddyAgent();
        try {
            Class<?> type = classLoader.loadClass(Bar.class.getName());
            assertThat(type.getDeclaredMethod(FOO).invoke(type.newInstance()), is((Object) BAR));
        } finally {
            ByteBuddyAgent.getInstrumentation().removeTransformer(classFileTransformer);
        }
    }
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ShouldRebase {
        /* empty */
    }

    @ShouldRebase
    public static class Bar {
        public String foo() {
            return FOO;
        }
    }
    public static class BarTransformer implements AgentBuilder.Transformer {

        @Override
        public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder, TypeDescription typeDescription) {
            try {
                return builder.method(named(FOO)).intercept(MethodDelegation.to(new Interceptor()));
            } catch (Exception exception) {
                throw new AssertionError(exception);
            }
        }

        public static class Interceptor {

            public String intercept() {
                return BAR;
            }
        }
    }

}
