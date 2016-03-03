package hare.asm;

import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.AdviceAdapter;

public class HMethodAdapter extends AdviceAdapter {
    private String className;
    private String methodName;

    protected HMethodAdapter(int api, MethodVisitor mv, int access, String name, String desc, String className) {
        super(api, mv, access, name, desc);
        this.className = className;
        this.methodName = name;
    }

    @Override
    protected void onMethodEnter() {
        log(true, className, methodName);
        super.onMethodEnter();
    }

    @Override
    protected void onMethodExit(int opcode) {
        super.onMethodExit(opcode);
        log(false, className, methodName);
    }

    private void log(boolean isStart, String clazName, String methodName) {
        visitFieldInsn(Opcodes.GETSTATIC, "hare/writer/CustomWriter", "INSTANCE", "Lhare/writer/CustomWriter;");
        visitLdcInsn(isStart);
        visitLdcInsn(clazName);
        visitLdcInsn(methodName);
        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "currentTimeMillis", Type.getMethodDescriptor(Type.LONG_TYPE), false);
        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Thread", "currentThread", Type.getMethodDescriptor(Type.getType(Thread.class)), false);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/Thread", "getName", Type.getMethodDescriptor(Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ALOAD, 0);
        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "identityHashCode", Type.getMethodDescriptor(Type.INT_TYPE, Type.getType(Object.class)), false);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "hare/writer/CustomWriter", "log",
                Type.getMethodDescriptor(Type.VOID_TYPE, Type.BOOLEAN_TYPE, Type.getType(String.class), Type.getType(String.class),
                        Type.LONG_TYPE, Type.getType(String.class), Type.INT_TYPE), false);
    }

    private void logSimple(String prefix) {
        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Thread", "currentThread",
                Type.getMethodDescriptor(Type.getType(Thread.class)), false);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/Thread", "getName",
                Type.getMethodDescriptor(Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ASTORE, 1);

        visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "currentTimeMillis",
                Type.getMethodDescriptor(Type.LONG_TYPE), false);
        visitVarInsn(Opcodes.LSTORE, 2);

        visitTypeInsn(Opcodes.NEW, "java/lang/StringBuilder");
        visitInsn(Opcodes.DUP);
        visitMethodInsn(Opcodes.INVOKESPECIAL, "java/lang/StringBuilder", "<init>", "()V", false);
        visitLdcInsn(prefix + className + "|" + methodName + "|");
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        visitVarInsn(Opcodes.LLOAD, 2);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.LONG_TYPE), false);
        visitLdcInsn("|");
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ALOAD, 1);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "append",
                Type.getMethodDescriptor(Type.getType(StringBuilder.class), Type.getType(String.class)), false);

        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/lang/StringBuilder", "toString",
                Type.getMethodDescriptor(Type.getType(String.class)), false);
        visitVarInsn(Opcodes.ASTORE, 1);
        visitFieldInsn(Opcodes.GETSTATIC, "hare/writer/CustomWriter", "INSTANCE", "Lhare/writer/CustomWriter;");
        visitVarInsn(Opcodes.ALOAD, 1);
        visitMethodInsn(Opcodes.INVOKEVIRTUAL, "hare/writer/CustomWriter", "log",
                Type.getMethodDescriptor(Type.VOID_TYPE, Type.getType(String.class)), false);
    }
}
