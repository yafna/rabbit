package hare.asm;

import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;

public class HMethodVisitor extends MethodVisitor {
    public HMethodVisitor(int api, MethodVisitor mv) {
        super(api, mv);
    }

    @Override
    public void visitEnd() {
        super.visitEnd();
    }

    @Override
    public void visitCode() {
        super.visitCode();
        mv.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        mv.visitLdcInsn("M name :  Th name : ");
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println",
                Type.getMethodDescriptor(Type.VOID_TYPE, Type.getType(String.class)), false);
    }
}
