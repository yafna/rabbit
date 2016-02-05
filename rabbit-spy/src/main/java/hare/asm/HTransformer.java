package hare.asm;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.util.CheckClassAdapter;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.PrintWriter;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class HTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
        System.out.println("Th " + Thread.currentThread().getName() + " Processing class " + className);

        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
        ClassVisitor cc = new CheckClassAdapter(cw);
        ClassVisitor tv =  new TraceClassVisitor(cc, new PrintWriter(System.out));
        ClassReader cr = new ClassReader(classfileBuffer);
        cr.accept(tv, ClassReader.SKIP_DEBUG);
        byte[] newBytecode = cw.toByteArray();

        return classfileBuffer;
    }
}
