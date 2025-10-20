import * as dns from 'dns'; // npm install typescript @types/node

/**
 * Validação da sintaxe
 */
function isValidEmailSyntax(email: string): boolean {
    const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(email);
}

/**
 * Indica se o email recebe emails
 */
async function hasMxRecords(domain: string): Promise<boolean> {
    return new Promise((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err) {
                if (err.code === 'ENODATA' || err.code === 'NOTFOUND' || err.code === 'ESERVFAIL') {
                    resolve(false);
                } else {
                    console.error(`DNS MX lookup error for ${domain}:`, err);
                    resolve(false);
                }
            } else {
                resolve(addresses.length > 0);
            }
        });
    });
}

export async function verifyEmailDeliverability(email: string): Promise<boolean> {
    if (!isValidEmailSyntax(email)) {
        console.log(`"${email}" failed syntax validation.`);
        return false;
    }

    // Extração do domínio
    const domain = email.split('@')[1];

    if (!domain) {
        console.log(`Could not extract domain from "${email}".`);
        return false;
    }

    const mxExists = await hasMxRecords(domain);
    if (!mxExists) {
        console.log(`"${domain}" has no MX records, email "${email}" is likely not deliverable.`);
        return false;
    }

    console.log(`"${email}" passed syntax and MX record checks.`);
    return true;
}