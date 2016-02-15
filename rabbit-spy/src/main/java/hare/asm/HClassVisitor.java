package hare.asm;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.util.Printer;
import org.objectweb.asm.util.Textifier;

import java.io.PrintWriter;

public class HClassVisitor extends ClassVisitor {

    //The object that actually converts visit events into text.
    public final Printer p;

    // The print writer to be used to print the class. May be null.
    private PrintWriter pw = null;

    public HClassVisitor(final ClassVisitor cv) {
        super(Opcodes.ASM5, cv);
        this.p = new Textifier();
    }

    public HClassVisitor(final ClassVisitor cv, final PrintWriter pw) {
        super(Opcodes.ASM5, cv);
        this.pw = pw;
        this.p = new Textifier();
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        MethodVisitor mv = cv == null ? null : cv.visitMethod(access, name, desc, signature, exceptions);

        mv.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Thread", "currentThread",
                Type.getMethodDescriptor(Type.getType(Thread.class)), false);
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/Thread", "getName",
                Type.getMethodDescriptor(Type.getType(String.class)), false);

        mv.visitVarInsn(Opcodes.ASTORE, 1);
        mv.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        mv.visitTypeInsn(Opcodes.NEW, "java/lang/StringBuilder");
        mv.visitInsn(Opcodes.DUP);

        mv.visitMethodInsn(Opcodes.INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        mv.visitLdcInsn("M name : " + name + " Th name : ");
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        mv.visitVarInsn(Opcodes.ALOAD, 1);
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "toString",
                Type.getMethodDescriptor(Type.getType(String.class)), false);
        mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println",
                Type.getMethodDescriptor(Type.VOID_TYPE, Type.getType(String.class)), false);

        return new HMethodVisitor(Opcodes.ASM5, mv);
    }

}
