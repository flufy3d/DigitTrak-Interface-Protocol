import time
import main
if __name__ == '__main__':   
    try:
        print 'start main'
        main.main()
    except Exception, e:
        raise e
    finally:
        print 'wait some time'
        time.sleep(0.01)