package hare.asm;

import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.AdviceAdapter;

public class HMethodAdapter extends AdviceAdapter {

    protected HMethodAdapter(int api, MethodVisitor mv, int access, String name, String desc) {
        super(api, mv, access, name, desc);
    }

    @Override
    protected void onMethodEnter() {
        logSimple("Method start ");
        super.onMethodEnter();
    }

    @Override
    protected void onMethodExit(int opcode) {
        super.onMethodExit(opcode);
        logSimple("Method end ");
    }

    private void logSimple(String prefix){
        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Thread", "currentThread",
                Type.getMethodDescriptor(Type.getType(Thread.class)), false);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/Thread", "getName",
                Type.getMethodDescriptor(Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ASTORE, 1);

        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "currentTimeMillis",
                Type.getMethodDescriptor(Type.LONG_TYPE), false);
        visitVarInsn(Opcodes.LSTORE, 2);

        visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
        visitTypeInsn(Opcodes.NEW, "java/lang/StringBuilder");
        visitInsn(Opcodes.DUP);

        visitMethodInsn(Opcodes.INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        visitLdcInsn(prefix + " Millis : ");
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        visitVarInsn(Opcodes.LLOAD, 2);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.LONG_TYPE), false);
        visitLdcInsn(" Th name : ");
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ALOAD, 1);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);

        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "toString",
                Type.getMethodDescriptor(Type.getType(String.class)), false);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println",
                Type.getMethodDescriptor(Type.VOID_TYPE, Type.getType(String.class)), false);
    }
}
