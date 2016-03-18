/**
 * Copyright (c) 2016 CA.  All rights reserved.
 *
 * This software and all information contained therein is confidential and proprietary and may not be duplicated,
 * disclosed or reproduced in whole or in part for any purpose except as authorized by the applicable license agreement,
 * without the express written authorization of CA. All authorized reproductions must be marked with this language.
 *
 * TO THE EXTENT PERMITTED BY APPLICABLE LAW, CA PROVIDES THIS SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND,
 * INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NONINFRINGEMENT.
 * IN NO EVENT WILL CA BE LIABLE TO THE END USER OR ANY THIRD PARTY FOR ANY LOSS OR DAMAGE, DIRECT OR INDIRECT,
 * FROM THE USE OF THIS MATERIAL, INCLUDING WITHOUT LIMITATION, LOST PROFITS, BUSINESS INTERRUPTION, GOODWILL, OR LOST DATA,
 * EVEN IF CA IS EXPRESSLY ADVISED OF SUCH LOSS OR DAMAGE.
 */
package com.ca.mf.msme;


import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Type;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.ProtectionDomain;

import static org.objectweb.asm.Opcodes.ACC_FINAL;
import static org.objectweb.asm.Opcodes.ACC_PUBLIC;
import static org.objectweb.asm.Opcodes.ACC_STATIC;

public class CopyrightAgent {
    public static final String copyright_notice = "Copyright \u00A9 2015 CA, Inc.  All rights reserved.";
    private static final int NUMBER_OF_BYTES = 1024;
    private URL url;
    private Path root;

    public CopyrightAgent(String path) throws MalformedURLException, URISyntaxException {
        this.root = Paths.get(path);
        this.url = root.toUri().toURL();
    }

    public static void main(String[] args) {
        if (args.length == 1) {
            try {
                CopyrightAgent agent = new CopyrightAgent(args[0]);
                agent.process();
            } catch (URISyntaxException | IOException e) {
                System.out.println("failed to instrument classes with copyright");
                e.printStackTrace();
            }
        } else {
            System.out.println("bad args = " + args + ", required only one source folder to scan");
        }
    }

    public static String buildClassNameFromEntryString(String classEntryString) {
        String classNameForLoader = classEntryString;
        if (classEntryString.endsWith(".class")) {
            classNameForLoader = classNameForLoader.replace(".class","");
            classNameForLoader = classNameForLoader.replace("/", ".");
        }
        return classNameForLoader;
    }

    private void process() throws IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        classLoader = new URLClassLoader(new URL[]{url}, classLoader);
        final ClassFileTransformer transformer = new ClassFileTransformer() {
            @Override
            public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined, ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
                try {
                    ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
                    cw.visitField(ACC_PUBLIC + ACC_FINAL + ACC_STATIC, "copyright_notice", Type.getType(String.class).getDescriptor(), null, "Copyright \u00A9 2015 CA, Inc.  All rights reserved.").visitEnd();
                    ClassReader cr = new ClassReader(classfileBuffer);
                    cr.accept(cw, ClassReader.EXPAND_FRAMES);
                    return cw.toByteArray();
                } catch (Throwable th) {
                    th.printStackTrace();
                }
                return classfileBuffer;
            }
        };
        final ClassLoader finalClassLoader = classLoader;
        Files.walkFileTree(root, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path filePath, BasicFileAttributes attrs) throws IOException {
                if (filePath.toString().endsWith(".class")) {
                    byte[] originalClassBytes = null;
                    String entryName = root.relativize(filePath).toString().replace(File.separator, "/");
                    String className = buildClassNameFromEntryString(entryName);
                    try {
                        Class thisClass = finalClassLoader.loadClass(className);
                        InputStream is = finalClassLoader.getResourceAsStream(entryName);
                        if (is != null) {
                            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                                byte[] bytes = new byte[NUMBER_OF_BYTES];
                                int bytesRead = is.read(bytes, 0, NUMBER_OF_BYTES);
                                while (bytesRead >= 0) {
                                    baos.write(bytes, 0, bytesRead);
                                    bytesRead = is.read(bytes, 0, NUMBER_OF_BYTES);
                                }
                                originalClassBytes = baos.toByteArray();
                            } finally {
                                is.close();
                            }
                        }
                        byte[] transferredClassBytes = transformer.transform(finalClassLoader,
                                className.replace('.', '/'), thisClass, null, originalClassBytes);
                        FileOutputStream fos = null;
                        try {
                            fos = new FileOutputStream(filePath.toFile());
                            fos.write(transferredClassBytes);
                        } finally {
                            if (fos != null) {
                                fos.close();
                            }
                        }
                    } catch (ClassNotFoundException | IllegalClassFormatException e) {
                        System.out.println("failed to instrument file with copyright filename: " + filePath.toString());
                        System.out.println("error: " + e.getLocalizedMessage());
                    }
                }
                return FileVisitResult.CONTINUE;
            }
        });
    }
}
