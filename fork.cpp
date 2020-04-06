//Jason Panella
//CECS 326
//April 5, 2020
//Fork Programming
//This program code defines the parent and child processes
//for searching for occurences of a letter in an array
#include <iostream>
#include <cstdio>
#include <string>
#include <cctype>
#include <vector>
#include <sstream>
#include <unistd.h>
#include <cstdlib>
#include <algorithm>

using namespace std;

//basic function to create an array of user-specified size with random upper case letters 
char* generateRandomCharArray(int n)
{
    char alphabet[26] = {'A', 'B', 'C', 'D', 'E', 'F', 'G',
              	'H', 'I', 'J', 'K', 'L', 'M', 'N',  
              	'O', 'P', 'Q', 'R', 'S', 'T', 'U',
              	'V', 'W', 'X', 'Y', 'Z'};

    char * ch = new char[n + 1];

    int i = 0;
    for (; i < n; i++)  
   	 ch[i] = alphabet[rand() % 26];

    ch[i] = '\0';

    return ch;
}

int main(){
    //size of array to be created
    int size = 0;
    //letter to search for
    char searchLetter;
    //array filled with random upper case letters
    string* rawBytes;
    string loop = "---Not Found: Infinite loop--";

    bool run = true;
    while (run) {

        cout << "\nEnter the size of the array. Type -1 to exit." << endl;
        cin >> size;
        
        if (size == -1){
            exit(0);
        }

        cout << "Enter the letter to search for." << endl;
        cin >> searchLetter;
        searchLetter = toupper(searchLetter);

        cout << "Starting search..." << endl;

        int child = fork();
        if (child == 0){ //in child
             srand(time(NULL));

            //keeps track of occurences of searchLetter found
            int occurences = 0;
            //allocating memory and filling it with random upper case letters
            rawBytes = new string(generateRandomCharArray(size));

            bool found = false;
            while(!found){ //injected bug to cause infinite loop

                //counts number of occurences of searchLetter in the rawBytes array
                occurences = std::count((*rawBytes).begin(), (*rawBytes).end(), searchLetter);

                if(occurences) //if found stop the loop and print
                    found = true; 
                else  //else infinite loop
                    cout << loop << endl;
            }

            //printing the searchLetter and the number of times it was found
            cout << "...Search Letter '" << searchLetter << "' appeared " << occurences << " times." << endl;

            //deallocating memory
            delete rawBytes;
            exit(0);
        }
    }
    cout << endl;
    return 0;
}