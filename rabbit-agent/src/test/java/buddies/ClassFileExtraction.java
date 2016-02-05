package buddies;

import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.jar.asm.ClassReader;
import net.bytebuddy.jar.asm.ClassWriter;
import org.junit.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class ClassFileExtraction {
    private static final int ASM_MANUAL = 0;

    private static final int CA = 0xCA, FE = 0xFE, BA = 0xBA, BE = 0xBE;

    public static Map<String, byte[]> of(Class<?>... type) throws IOException {
        Map<String, byte[]> result = new HashMap<String, byte[]>();
        for (Class<?> aType : type) {
            result.put(aType.getName(), extract(aType));
        }
        return result;
    }

    public static byte[] extract(Class<?> type, AsmVisitorWrapper asmVisitorWrapper) throws IOException {
        ClassReader classReader = new ClassReader(type.getName());
        ClassWriter classWriter = new ClassWriter(classReader, ASM_MANUAL);
        classReader.accept(asmVisitorWrapper.wrap(new TypeDescription.ForLoadedType(type), classWriter), ASM_MANUAL);
        return classWriter.toByteArray();
    }

    public static byte[] extract(Class<?> type) throws IOException {
        return extract(type, new AsmVisitorWrapper.Compound());
    }

    @Test
    public void testClassFileExtraction() throws Exception {
        byte[] binaryFoo = extract(Foo.class);
        assertThat(binaryFoo.length > 4, is(true));
        assertThat(binaryFoo[0], is(new Integer(CA).byteValue()));
        assertThat(binaryFoo[1], is(new Integer(FE).byteValue()));
        assertThat(binaryFoo[2], is(new Integer(BA).byteValue()));
        assertThat(binaryFoo[3], is(new Integer(BE).byteValue()));
    }

    private static class Foo {
        /* empty */
    }
}
