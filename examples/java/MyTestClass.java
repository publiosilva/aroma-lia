import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.File;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.io.FileMatchers.*;

@RunWith(JUnit4.class)
public class MyTestClass {
    @Test
    public void testCloneNonBareRepoFromLocalTestServer() throws Exception {
        Clone cloneOp = new Clone(false, integrationGitServerURIFor("small-repo.early.git"), helper().newFolder());

        Repository repo = executeAndWaitFor(cloneOp);

        assertThat(repo, hasGitObject("ba1f63e4430bff267d112b1e8afc1d6294db0ccc"));

        File readmeFile = new File(repo.getWorkTree(), "README");
        assertThat(readmeFile, exists());
        assertThat(readmeFile.length(), equalTo(12L));
    }

    @Test
    public void testXmlSanitizer() {
        boolean valid = XmlSanitizer.isValid("Fritzbox");
        assertEquals("Fritzbox is valid", true, valid);
        System.out.println("Pure ASCII test - passed");

        valid = XmlSanitizer.isValid("Fritz Box");
        assertEquals("Spaces are valid", true, valid);
        System.out.println("Spaces test - passed");

        valid = XmlSanitizer.isValid("Frützbüx");
        assertEquals("Frützbüx is invalid", false, valid);
        System.out.println("No ASCII test - passed");

        valid = XmlSanitizer.isValid("Fritz!box");
        assertEquals("Exclamation mark is valid", true, valid);
        System.out.println("Exclamation mark test - passed");

        valid = XmlSanitizer.isValid("Fritz.box");
        assertEquals("Exclamation mark is valid", true, valid);
        System.out.println("Dot test - passed");

        valid = XmlSanitizer.isValid("Fritz-box");
        assertEquals("Minus is valid", true, valid);
        System.out.println("Minus test - passed");

        valid = XmlSanitizer.isValid("Fritz-box");
        assertEquals("Minus is valid", true, valid);
        System.out.println("Minus test - passed");
    }
}
