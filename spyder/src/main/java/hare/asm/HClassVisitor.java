package hare.asm;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class HClassVisitor extends ClassVisitor {

    private String className;

    public HClassVisitor(final ClassVisitor cv, String className) {
        super(Opcodes.ASM5, cv);
        this.className =className;
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        MethodVisitor mv = cv == null ? null : cv.visitMethod(access, name, desc, signature, exceptions);
        return new HMethodAdapter(Opcodes.ASM5, mv, access, name, desc, className);
    }
}
