import * as readline from "readline";
import { Contact } from "./Contact";
import { AddressBookMain } from "./addressBook";

export class AddressBookSystem {
    private addressBooks: { [key: string]: AddressBookMain } = {};
    private currentBookName: string | null = null;

    public rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {
        this.showWelcome();
    }

    private showWelcome() {
        console.log("Welcome to the Address Book System");
        this.selectOrCreateAddressBook();
    }

    private selectOrCreateAddressBook() {
        console.log(`
            Press 1 for Create a new Address Book
            Press 2 Select existing Address Book
            Press 3 for exit
        `);

        this.rl.question("Enter Your Choice: ", (choice) => {
            switch (choice.trim()) {
                case '1':
                    this.rl.question("Enter the name of AddressBook: ", (bookName) => {
                        if (this.addressBooks[bookName]) {
                            console.log("Address Book already exist")
                        }
                        else {
                            this.addressBooks[bookName] = new AddressBookMain(this.rl, () => this.selectOrCreateAddressBook());
                            this.currentBookName = bookName;
                            console.log(`created or switched to ${bookName} AddressBook`)
                            this.addressBooks[bookName].displayAddressBook();
                        }
                        // this.mainMenu(); 
                    })
                    break;
                case '2':
                    const bookNames = Object.keys(this.addressBooks);

                    //check the existence of the address book
                    if (bookNames.length === 0) {
                        console.log("AddressBook Not exists")
                        this.selectOrCreateAddressBook();
                        return;
                    }

                    //addressbook exists and list all the books
                    bookNames.forEach((item, index) => console.log(`${index + 1} - ${item}`))

                    //take input for the address book
                    this.rl.question("Enter the address book name: ", (bookName) => {
                        if (this.addressBooks[bookName]) {
                            this.currentBookName = bookName;
                            console.log(`You have selected ${bookName} addressbook`)
                            this.addressBooks[bookName].displayAddressBook();
                        }
                        else {
                            console.log("address book not found")
                            this.selectOrCreateAddressBook();
                        }
                    })
                    break;
                case "3":
                    console.log("Exiting...");
                    this.rl.close();
                    break;

                default:
                    console.log("Invalid Input")
                    this.selectOrCreateAddressBook();
                    break;
            }
        })
    }
}

const addressBookSytem = new AddressBookSystem();