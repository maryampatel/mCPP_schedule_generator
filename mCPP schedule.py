import datetime

def calculate_start_date_and_time(start_date, start_time):
    '''(str, str) -> datetime object. '''
    
    start_time_hours, start_time_minutes = int(start_time[:2]), int(start_time[2:])
    start_year, start_month, start_day = int(start_date[:4]), int(start_date[5:7]), int(start_date[8:])
    return datetime.datetime(year=start_year, month=start_month, day=start_day, hour=start_time_hours, minute=start_time_minutes)

def add_time(start_time, time_to_add):
    '''(datetime object, str) -> datetime object. '''
    
    return start_time + datetime.timedelta(hours=int(time_to_add[:2]), minutes=int(time_to_add[2:]))

def subtract_time(start_time, time_to_subtract):
    '''(datetime object, str) -> datetime object. '''
    
    return start_time - datetime.timedelta(hours=int(time_to_subtract[:2]), minutes=int(time_to_subtract[2:]))
    
def convert_to_date(datetime_object_to_print):
    '''(datetime object) -> str. '''

    datetime_string = datetime_object_to_print.ctime()
    return datetime_string[:10] + datetime_string[-5:]

def convert_to_time(datetime_object_to_print):
    '''(datetime object) -> str. '''
    
    datetime_string = datetime_object_to_print.ctime()
    return datetime_string[11:16]

def conditioning_times(cond_start_date, cond_start_time, number_of_days, time_to_condition, pretreatment1, pretreatment1_time, pretreatment2, pretreatment2_time):
    '''(str, str, int, str, str, str, str, str) -> None
    Given the starting date, starting time (time of first morphine injection), number of days spent conditioning (normally 8), 
    time between conditioning (i.e. time span between when the first animal and last animal is done being conditioned, which depends on
    various factors such as whether animals are given infusions, and the number of animals you use), and name and times of pretreatments (optional);
    this function prints a conditioning schedule for mCPP in dependent animals. '''

    time_in_box = '0040'
    time_until_heroin = '0315'
    time_until_morphine = '2100'

    day = 1

    cond_start_date_and_time = calculate_start_date_and_time(cond_start_date, cond_start_time)
    
    while day <= number_of_days:

        if day == 1:
            day_0_heroin = subtract_time(cond_start_date_and_time, time_until_morphine)
            print("Day 0 - " + convert_to_date(day_0_heroin))
            print("Inject heroin at " + convert_to_time(day_0_heroin))
            print(" ")
        
        print("Day " + str(day) + " - " + convert_to_date(cond_start_date_and_time))
        
        if pretreatment1 != None:
            pretreatment1_injection_time = subtract_time(cond_start_date_and_time, pretreatment1_time)
            print(pretreatment1 + " at " + convert_to_time(pretreatment1_injection_time))
        
        if pretreatment2 != None:
            pretreatment2_injection_time = subtract_time(cond_start_date_and_time, pretreatment2_time)
            print(pretreatment2 + " at " + convert_to_time(pretreatment2_injection_time))
        
        cond_end_time = add_time(cond_start_date_and_time, time_in_box)
        total_end_time = add_time(cond_end_time, time_to_condition)
        heroin_injection_time = add_time(cond_end_time, time_until_heroin)
        
        print("First morphine injection at " + convert_to_time(cond_start_date_and_time))
        print("Take first rat out of box at " + convert_to_time(cond_end_time))
        print("Finish conditioning at " + convert_to_time(total_end_time))
        
        if day < 8:
            print("Heroin injection at " + convert_to_time(heroin_injection_time))
            print(" ")

        else:
            print(" ")
            print("Congrats, you are done!")
        
        cond_start_date_and_time = add_time(add_time(heroin_injection_time, time_to_condition), time_until_morphine)
        day = day + 1

if __name__ == "__main__":

    print("When will you begin conditioning? (yyyy/mm/dd)")
    cond_start_date = raw_input()
    print("What time will you begin conditioning (i.e. administer first morphine injection)?")
    print("Note: This program uses a 24 hour clock (i.e. 7:00 AM is 0700 and 7:00 PM is 1900).")
    cond_start_time = raw_input()
    print("How much extra time will you need between animals (i.e. time interval between first and last animal).")
    time_to_condition = raw_input()
    print("How many days will you be conditioning for?")
    number_of_days = int(raw_input())
    print("Please enter name of first pretreatment/micro-infusion (if none, press ENTER key).")
    pretreatment1 = raw_input()
    print("Please enter time of first pretreatment/micro-infusion (if none, press ENTER key)")
    pretreatment1_time = raw_input()
    print("Please enter name of second pretreatment/micro-infusion (if none, press ENTER key).")
    pretreatment2 = raw_input()
    print("Please enter time of second pretreatment/micro-infusion (if none, press ENTER key)")
    pretreatment2_time = raw_input()

    conditioning_times(cond_start_date, cond_start_time, number_of_days, time_to_condition, pretreatment1, pretreatment1_time, pretreatment2, pretreatment2_time)




