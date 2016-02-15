package hare.asm;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class HTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        if (className.startsWith("forest/city")) {
            try {
                ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
                ClassVisitor cc = new HClassVisitor(cw);
                ClassReader cr = new ClassReader(classfileBuffer);
                cr.accept(cc, ClassReader.SKIP_DEBUG);
                return cw.toByteArray();
            } catch (Throwable th) {
                System.out.println("alarmalarm " + th.getLocalizedMessage());
                th.printStackTrace();
            }
        }
        return classfileBuffer;
    }
}
