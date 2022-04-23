function is_less_than(p1, p2)
{
    if(p1.burst_time != p2.burst_time) return p1.burst_time < p2.burst_time;
    return p1.arrival_time < p2.arrival_time;
}

class SpnReadyQueue extends MinHeap{


    //프로세스를 처리하기위해 재정의한 버블 업/ 다운 함수 
    bubbleUp(){
        let index = this.items.length-1;
        while(this.parent(index) !== undefined && is_less_than(this.items[index], this.parent(index))){
            this.swap(index, this.parentIndex(index));
            index = this.parentIndex(index);
        }
    }
    
    bubbleDown(){
        let index = 0;
        while((this.leftChild(index) !== undefined && is_less_than(this.leftChild(index), this.items[index])) || (this.rightChild(index) !== undefined && is_less_than(this.rightChild(index), this.items[index]))){

            let smallerIndex = this.leftChildIndex(index);
            
            if(this.rightChild(index) !== undefined && is_less_than(this.rightChild(index), this.items[smallerIndex])){
                smallerIndex = this.rightChildIndex(index);
            }
            this.swap(index, smallerIndex);
            index = smallerIndex;
        }
    }
}


