package hare.asm;

import java.lang.instrument.Instrumentation;

public class HAgent {
    public static void premain(String agentArguments, Instrumentation instrumentation) {
        HTransformer transformer = new HTransformer();
        instrumentation.addTransformer(transformer);
    }
}
