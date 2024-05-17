import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.File;

import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.io.FileMatchers.*;

@RunWith(JUnit4.class)
public class Test {
    @Test
    public void testCloneNonBareRepoFromLocalTestServer() throws Exception {
        Clone cloneOp = new Clone(false, integrationGitServerURIFor("small-repo.early.git"), helper().newFolder());

        Repository repo = executeAndWaitFor(cloneOp);

        assertThat(repo, hasGitObject("ba1f63e4430bff267d112b1e8afc1d6294db0ccc"));

        File readmeFile = new File(repo.getWorkTree(), "README");
        assertThat(readmeFile, exists());
        assertThat(readmeFile, ofLength(12));
    }

    @Test
    public void testAddition() {
        Calculator calculator = new Calculator();
        
        // Perform addition
        int result = calculator.add(2, 3);
        
        // Assert the result twice
        assertEquals(5, result);
        assertEquals(5, result); // Duplicate assertion
    }
}
